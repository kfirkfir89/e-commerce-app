import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <section className="flex h-full items-center p-16">
        <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
          <div className="max-w-md text-center">
            <h2 className="mb-8 text-9xl font-extrabold">
              <span className="sr-only">Error</span>
              404
            </h2>
            <p className="text-2xl font-semibold md:text-3xl">
              Sorry, we couldn&apos;t find this page.
            </p>
            <p className="mt-4 mb-8">
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
