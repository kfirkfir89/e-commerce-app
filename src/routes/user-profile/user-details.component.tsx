import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import {
  selectCurrentUser,
  selectUserIsLoading,
} from '../../store/user/user.selector';
import FormInput from '../../components/input-form/input-form.component';
import { updateUserDataStart } from '../../store/user/user.action';

export type UserDetailsFormFields = {
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp;
  email: string;
  sendNotification: boolean;
};

const UserDetails = () => {
  const currentUserSelector = useSelector(selectCurrentUser);
  const currentUserIsLoading = useSelector(selectUserIsLoading);
  // set defualy values from userslector
  const defaultFormFields: UserDetailsFormFields = {
    firstName: currentUserSelector?.firstName
      ? currentUserSelector?.firstName
      : '',
    lastName: currentUserSelector?.lastName
      ? currentUserSelector?.lastName
      : '',
    dateOfBirth: currentUserSelector?.dateOfBirth
      ? currentUserSelector?.dateOfBirth
      : Timestamp.fromDate(new Date()),
    email: currentUserSelector?.email ? currentUserSelector?.email : '',

    sendNotification: currentUserSelector?.sendNotification
      ? currentUserSelector?.sendNotification
      : false,
  };
  const [formFields, setFormFields] =
    useState<UserDetailsFormFields>(defaultFormFields);
  const [isChangeMade, setIsChangeMade] = useState(true);
  const [didRender, setDidRender] = useState(false);

  const dispatch = useDispatch();

  // first reneder check
  useEffect(() => {
    setDidRender(true);
  }, []);
  // check if there is change from previous userData
  function equalSortsObjects(
    compare: UserDetailsFormFields,
    form: UserDetailsFormFields
  ): boolean {
    if (
      JSON.stringify(compare.firstName) === JSON.stringify(form.firstName) &&
      JSON.stringify(compare.lastName) === JSON.stringify(form.lastName) &&
      JSON.stringify(compare.email) === JSON.stringify(form.email) &&
      JSON.stringify(compare.sendNotification) ===
        JSON.stringify(form.sendNotification) &&
      JSON.stringify(compare.dateOfBirth) === JSON.stringify(form.dateOfBirth)
    ) {
      return true;
    }
    return false;
  }

  // check if change has made
  useEffect(() => {
    if (didRender && currentUserSelector !== null) {
      const { firstName, lastName, email, dateOfBirth, sendNotification } =
        currentUserSelector;
      const compare: UserDetailsFormFields = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        sendNotification,
      };

      if (!equalSortsObjects(compare, formFields)) {
        setIsChangeMade(false);
      } else {
        setIsChangeMade(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFields]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentUserSelector) {
      dispatch(updateUserDataStart(formFields, currentUserSelector.uid));
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setFormFields({
        ...formFields,
        [e.target.name]: !formFields.sendNotification,
      });
    }
  };

  const handleDateValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; // Get the date from the input field

    // Convert the date to a Timestamp
    const timestamp = Timestamp.fromDate(new Date(date));

    setFormFields({ ...formFields, dateOfBirth: timestamp });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1 className="mb-4 flex  justify-center p-6 font-smoochSans text-lg font-semibold uppercase tracking-wide">
        my details
      </h1>
      <div className="w-2/3">
        <form className="flex flex-col gap-y-6 sm:px-4" onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="firstName"
            label="First Name"
            pattern="^[A-Za-z0-9]{3,16}$"
            onChange={onChange}
            value={formFields.firstName}
            required
            errorMessage="First name should be 3-16 characters and shouldn't include any special character!"
          />
          <FormInput
            type="text"
            name="lastName"
            label="Last Name"
            pattern="^[A-Za-z0-9]{3,16}$"
            onChange={onChange}
            value={formFields.lastName}
            required
            errorMessage="Last name should be 3-16 characters and shouldn't include any special character!"
          />
          <FormInput
            type="email"
            name="email"
            label="Email"
            onChange={onChange}
            value={formFields.email}
            required
            errorMessage="It should be a valid email address!"
          />
          <input
            required
            type="date"
            onChange={handleDateValueChange}
            value={
              formFields.dateOfBirth
                ? `${
                    formFields.dateOfBirth.toDate().toISOString().split('T')[0]
                  }`
                : ''
            }
            className="flex min-h-[2.8em] w-full flex-shrink items-center bg-white p-2  text-gray-400 outline-none focus:border-[1px] focus:border-dashed focus:border-slate-400"
          ></input>
          <label className="label cursor-pointer">
            <span className="label-text">SEND ME NOTIFICATION</span>
            <input
              type="checkbox"
              className="checkbox-success checkbox text-slate-300"
              name="sendNotification"
              checked={
                formFields.sendNotification
                  ? formFields.sendNotification
                  : false
              }
              // checked={currentUserSelector?.sendNotification}
              onChange={handleCheckBox}
            />
          </label>
          <button
            type="submit"
            className={`${
              currentUserIsLoading ? 'loading' : ''
            } btn mt-4 w-full rounded-none shadow-sm`}
            disabled={isChangeMade}
          >
            <div
              className={`${
                currentUserIsLoading ? 'hidden' : ''
              } flex w-full items-center justify-center `}
            >
              <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                Save Changes
              </span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
