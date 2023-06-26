export const Spinner = () => (
  <div className="relative flex h-60v w-full items-center justify-center">
    <div className="absolute inline-block h-10 w-10 animate-spin-reverse rounded-[50%] border-2 border-t-gray-400 "></div>
    <div className="absolute inline-block h-6 w-6 animate-spin-slow rounded-[50%] border-2 border-t-gray-400"></div>
    <div className="border-image-clip-path absolute flex h-14 w-14 animate-spin-slow items-center justify-center rounded-[50%] border-2 border-t-gray-400 ease-in-out"></div>
  </div>
);

export default Spinner;
