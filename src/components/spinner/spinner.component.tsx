
export const Spinner = () => (
  <div className="flex h-60v justify-center items-center w-full relative">
    <div className="absolute inline-block w-10 h-10 border-2 rounded-[50%] border-t-gray-400 animate-spin-reverse ">
    </div>
    <div className="absolute inline-block w-6 h-6 border-2 rounded-[50%] border-t-gray-400 animate-spin-slow">
    </div>
    <div className="absolute border-image-clip-path flex justify-center items-center w-14 h-14 border-2 rounded-[50%] border-t-gray-400 animate-spin-slow ease-in-out">
    </div>
  </div>

);

export default Spinner;
