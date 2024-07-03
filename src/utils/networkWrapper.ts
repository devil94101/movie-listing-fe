"use client"
import axios from "axios"
import { v4 } from 'uuid'
import { auth } from "../firebase-config"

export const API_URL = process.env.REACT_APP_FIREBASE_API_URL;

let retry = false
let isRefreshing = false
let queue: (() => void)[] = []
let retries = 0

const onTokenRefresh = () => {
	queue.forEach(ele => {
		ele()
	})
	queue = []
}

const refreshAuthToken = () => {
	return new Promise((resolve) => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				user.getIdToken(true).then(token => {
					resolve(token)
				}).catch(() => {
					resolve('')
				})
			} else {
				console.log('No user is signed in');
				resolve('')
			}
		});
	})
}


export const headerParams = (default_headers: any = {}) => {
	const headers = default_headers
	
	const token: string = localStorage.getItem("token") || ""
	if (token) {
		headers["Authorization"] = `${token}`
	}
	headers["requestId"] = v4();
	return headers
}

const axiosInstance = axios.create({
	baseURL: API_URL,
	timeout: 300000,
	headers: headerParams(),
})

export const interceptor = () => {
	axiosInstance.interceptors.request.use(function (config) {
		const existing_headers = config?.headers ?? {}
		config.headers = headerParams(existing_headers)
		return config
	})

	axiosInstance.interceptors.response.use(
		(response) => {
			retries = 0
			return response
		},
		async (error) => {
			const originalRequest = error.config
			
			if (error?.response?.status === 401 && !retry && !isRefreshing && retries < 3) {
				retries++;
				isRefreshing = true
				retry = true
				const newToken = await refreshAuthToken() as string;
				localStorage.setItem('token', newToken)
				originalRequest.headers["Authorization"] = `${newToken}`
				isRefreshing=false
				const resp = await axiosInstance(originalRequest)
				onTokenRefresh()
				return resp
			}
			else if (error?.response?.status === 401 && (isRefreshing && retries < 3)) {
				return new Promise((resolve) => {
					const newPendingReq = () => {
						const token: string = localStorage.getItem("token") || ""
						originalRequest.headers["Authorization"] = ` ${token}`
						resolve(axiosInstance(originalRequest))
					}
					queue.push(newPendingReq)
				})
			}

			return Promise.reject(error?.response?.data)
		},
	)
}
interceptor()

export const AxiosInstance = axiosInstance
