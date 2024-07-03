import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { forwardRef, useRef } from 'react';
import { TextField } from '@mui/material';

type props = {
  onChange: (val: Date | null) => void;
  value: Date | null;
  showTime?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  format?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  labelOnSeprateLine?: boolean;
  labelClass?: string
  showTimeSelectOnly?: boolean
  showTimeInput?: boolean
};

const DateInput = forwardRef((props: any, ref: any) => {
  return (
    <div onClick={props.onClick} ref={ref}>
      <TextField
        value={props.value}
        onChange={() => {
          //
        }}
        aria-readonly
        placeholder={props.placeholder}
      />
    </div>
  );
});

export const DateTimeComponent = ({
  onChange,
  value,
  showTime,
  label,
  required,
  error,
  format,
  className,
  placeholder,
  disabled,
  minDate,
  maxDate,
  labelOnSeprateLine,
  labelClass,
  showTimeSelectOnly=false,
  showTimeInput
}: props) => {
  const dateFormat = showTime ? 'dd-MM-yyyy : hh:mm' : 'dd-MM-yyyy';

  const inputRef = useRef();

  const dateCompClass = classNames(
    `
    text-black border border-color-default py-3 rounded-md pl-2 w-full cursor-pointer
    `,
    {
      'border-error hover:border-error focus:border-error': !disabled && error,
    },
    {
      'cursor-not-allowed bg-[#efefef4d]': disabled,
    },
    className
  );

  return (
    <div>
      <div
        className={`flex items-center justify-between w-full ${
          labelOnSeprateLine ? 'flex-col !items-start gap-y-4' : ''
        }`}
      >
        {label && (
          <label
            htmlFor="Date"
            className={'leading-4 text-primary h-full mr-4 whitespace-nowrap min-w-40 ' + labelClass}
          >
            {label} {required && <span className="text-color-error">*</span>}
          </label>
        )}

        <DatePicker
          onChange={onChange}
          selected={value}
          showTimeInput={showTimeInput}
          dateFormat={format ? format : dateFormat}
          className={dateCompClass}
          placeholderText={placeholder}
          disabled={disabled}
          customInput={<DateInput ref={inputRef} placeholder={placeholder} />}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          showTimeSelect={showTime ? true : false}
          timeIntervals={15}
          timeCaption="Time"
          yearDropdownItemNumber={10}
          wrapperClassName="w-full "
          minDate={minDate}
          maxDate={maxDate}
          showTimeSelectOnly={showTimeSelectOnly}

        />
      </div>
      {error ? (
        labelOnSeprateLine ? (
          <div className="">
            <label className=" text-color-error break-all">
              {' '}
              {error}{' '}
            </label>
          </div>
        ) : (
          <div className="ml-44">
            <label className=" text-color-error break-all">
              {' '}
              {error}{' '}
            </label>
          </div>
        )
      ) : null}
    </div>
  );
};

export default DateTimeComponent;
