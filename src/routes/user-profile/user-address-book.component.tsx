import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Timestamp } from 'firebase/firestore';
import { v4 } from 'uuid';
import FormInput from '../../components/input-form/input-form.component';
import {
  selectCurrentUser,
  selectUserIsLoading,
} from '../../store/user/user.selector';
import { UserAddress } from '../../utils/firebase/firebase.user.utils';
import {
  removeUserAddress,
  updateUserAddressStart,
  updateUserDefualtAddress,
} from '../../store/user/user.action';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import Spinner from '../../components/spinner/spinner.component';

export type UserDetailsFormFields = {
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp;
  email: string;
  sendNotification: boolean;
};

const UserAddressBook = () => {
  const currentUserSelector = useSelector(selectCurrentUser);
  const currentUserIsLoading = useSelector(selectUserIsLoading);
  // set defualy values from userslector
  const defaultFormFields: UserAddress = {
    aid: v4(),
    firstName: '',
    lastName: '',
    mobile: 0,
    country: '',
    address: '',
    city: '',
    state: '',
    postcode: 0,
  };
  const [formFields, setFormFields] = useState<UserAddress>(defaultFormFields);
  const [userAddressBook, setUserAddressBook] = useState<UserAddress[]>([]);

  const modalRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  // set user addresses
  useEffect(() => {
    if (currentUserSelector) {
      const sortedAddresses = [...currentUserSelector.addresses];

      sortedAddresses.sort((a, b) => {
        if (a.aid === currentUserSelector.defualtAddressId) return -1;
        if (b.aid === currentUserSelector.defualtAddressId) return 1;
        return 0;
      });

      setUserAddressBook(sortedAddresses);
    }
  }, [currentUserSelector]);

  // close modal when uploading new address complate
  useEffect(() => {
    if (modalRef.current && !currentUserIsLoading) {
      modalRef.current.checked = false;
    }
  }, [currentUserIsLoading]);

  // add new address handler
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentUserSelector) {
      dispatch(updateUserAddressStart(formFields, currentUserSelector.uid));
    }
    setFormFields(defaultFormFields);
  };

  // on change formfield for adding new address modal
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  // set defualt address
  const checkboxDefualtHandler = (index: number) => {
    if (currentUserSelector) {
      dispatch(
        updateUserDefualtAddress(
          userAddressBook[index].aid,
          currentUserSelector.uid
        )
      );
    }
  };
  // remove chossen address by id
  const removeAddressHandler = (addressId: string) => {
    console.log('addressId:', addressId);
    setUserAddressBook(
      userAddressBook.filter((address) => address.aid !== addressId)
    );
    if (currentUserSelector) {
      dispatch(removeUserAddress(addressId, currentUserSelector.uid));
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <div className="z-[101] w-full">
        <div className="flex w-full ">
          {/* add address modal */}
          <div className="flex w-full justify-center bg-gray-100 px-4">
            <label
              htmlFor="my-modal-4"
              className="btn w-full max-w-md cursor-pointer rounded-none shadow-sm"
            >
              <div className={`flex w-full items-center justify-center `}>
                <span className="leading-0 flex  font-smoochSans text-xs font-semibold uppercase tracking-widest">
                  Add New Address
                </span>
              </div>
            </label>

            <input
              ref={modalRef}
              type="checkbox"
              id="my-modal-4"
              className="modal-toggle"
            />
            <label htmlFor="my-modal-4" className="modal cursor-pointer ">
              <label className="modal-box relative bg-white" htmlFor="">
                <h3 className="mb-4 text-lg font-bold tracking-wider">
                  Add New Address
                </h3>
                <form
                  className="flex flex-col gap-y-6 sm:px-4"
                  onSubmit={handleSubmit}
                >
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
                    type="tel"
                    name="mobile"
                    label="Mobile"
                    onChange={onChange}
                    value={formFields.mobile ? formFields.mobile : ''}
                    required
                    errorMessage="It should be a valid mobile address!"
                  />
                  <FormInput
                    type="text"
                    name="country"
                    label="Country"
                    pattern="^[A-Za-z0-9\s\-._]{3,32}$"
                    onChange={onChange}
                    value={formFields.country}
                    required
                    errorMessage="country should be 3-24 characters and shouldn't include only letters!"
                  />
                  <FormInput
                    type="text"
                    name="address"
                    label="Address"
                    pattern="^[A-Za-z0-9\s\-._]{3,32}$"
                    onChange={onChange}
                    value={formFields.address}
                    required
                    errorMessage="address should be 3-32 characters!"
                  />
                  <FormInput
                    type="text"
                    name="city"
                    label="City"
                    pattern="^[A-Za-z0-9\s\-._]{3,32}$"
                    onChange={onChange}
                    value={formFields.city}
                    required
                    errorMessage="address should be 3-32 characters!"
                  />
                  <FormInput
                    type="text"
                    name="state"
                    label="State"
                    pattern="^[A-Za-z0-9]{2,24}$"
                    onChange={onChange}
                    value={formFields.state}
                    required
                    errorMessage="address should be 3-24 characters!"
                  />
                  <FormInput
                    type="number"
                    name="postcode"
                    label="Postcode"
                    pattern="^[0-9]{3,8}$"
                    onChange={onChange}
                    value={formFields.postcode ? formFields.postcode : ''}
                    required
                    errorMessage="It should be a valid postcode!"
                  />
                  <button
                    type="submit"
                    className={`${
                      currentUserIsLoading ? 'loading' : ''
                    } btn mt-4 w-full rounded-none shadow-sm`}
                  >
                    <div
                      className={`${
                        currentUserIsLoading ? 'hidden' : ''
                      } flex w-full items-center justify-center `}
                    >
                      <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                        Add Address
                      </span>
                    </div>
                  </button>
                </form>
              </label>
            </label>
          </div>
        </div>
      </div>
      {/* exsisting addresess */}
      <div className="absolute flex h-full w-full pb-4 pt-20">
        <div className="scrollbarStyle relative flex h-full w-full flex-col gap-4 overflow-y-auto px-4">
          {currentUserIsLoading && (
            <div className="absolute z-50 flex h-full w-full flex-col items-center justify-center bg-gray-400 opacity-50">
              <Spinner />
            </div>
          )}
          {userAddressBook &&
            userAddressBook.map((address, index) => (
              <div
                key={`${address.aid}+${v4()}`}
                className="flex w-full flex-col bg-white p-4"
              >
                <div className="flex w-full flex-col gap-y-1 p-2 px-2 font-smoochSans tracking-widest">
                  <span>
                    {address.firstName} {address.lastName}
                  </span>
                  <span>{address.address}</span>
                  <span>{address.city}</span>
                  <span>{address.country}</span>
                  <span>{address.postcode}</span>
                  <span>{address.state}</span>
                  <span>{address.mobile}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 whitespace-nowrap bg-gray-100">
                  <button
                    onClick={() => removeAddressHandler(address.aid)}
                    type="button"
                    className="mr-1 flex items-center justify-center"
                  >
                    <span className="pr-2">Delete</span>
                    <DeleteIcon className="w-7" />
                  </button>
                  {currentUserSelector?.defualtAddressId === address.aid ? (
                    <label className="mr-[6px] flex items-center justify-center">
                      <span className="pr-2 font-semibold text-green-600">
                        Defualt Option
                      </span>
                    </label>
                  ) : (
                    <label className="mr-[6px] flex items-center justify-center">
                      <span className="pr-2">Set Defualt</span>
                      <input
                        type="checkbox"
                        onChange={() => checkboxDefualtHandler(index)}
                        className="checkbox-accent checkbox"
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserAddressBook;
