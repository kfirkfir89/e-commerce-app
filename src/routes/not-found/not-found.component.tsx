/* eslint-disable no-nested-ternary */
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const error: string | Error = location.state;
  console.log('error:', error);
  return (
    <div>
      <section className="flex h-full items-center p-16">
        <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
          <div className="max-w-md text-center">
            <h2 className="mb-8 text-9xl font-extrabold">
              <span className="sr-only">Error</span>
              404
            </h2>
            <h2 className="mb-8 font-extrabold">
              {typeof error === 'string' ? error : error.message}
            </h2>
            <p className="text-2xl font-semibold md:text-3xl">
              Sorry, we couldn&apos;t find this page.
            </p>
            <p className="mb-8 mt-4">
              But dont worry, you can find plenty of other things on our
              homepage.
            </p>
            <Link to="/" className="rounded px-8 py-3 font-semibold">
              Back to homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
