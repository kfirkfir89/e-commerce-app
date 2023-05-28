import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';

const UserAccount = () => {
  const currentUserSelector = useSelector(selectCurrentUser);

  return (
    <div className="flex h-full w-full flex-col bg-red-100">
      <div className="max-w-md p-8 dark:bg-gray-900 dark:text-gray-100 sm:flex sm:space-x-6">
        <div className="mb-6 h-44 w-full flex-shrink-0 sm:mb-0 sm:h-32 sm:w-32">
          <img
            src="https://source.unsplash.com/100x100/?portrait?1"
            alt=""
            className="h-full w-full rounded object-cover object-center dark:bg-gray-500"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Leroy Jenkins</h2>
            <span className="text-sm dark:text-gray-400">General manager</span>
          </div>
          <div className="space-y-1">
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                aria-label="Email address"
                className="h-4 w-4"
              >
                <path
                  fill="currentColor"
                  d="M274.6,25.623a32.006,32.006,0,0,0-37.2,0L16,183.766V496H496V183.766ZM464,402.693,339.97,322.96,464,226.492ZM256,51.662,454.429,193.4,311.434,304.615,256,268.979l-55.434,35.636L57.571,193.4ZM48,226.492,172.03,322.96,48,402.693ZM464,464H48V440.735L256,307.021,464,440.735Z"
                ></path>
              </svg>
              <span className="dark:text-gray-400">
                leroy.jenkins@company.com
              </span>
            </span>
            <span className="flex items-center space-x-2">{}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
