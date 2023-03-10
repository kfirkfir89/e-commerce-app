import {
  Link,
} from 'react-router-dom';

type NewCollectionAndDocForm = {
  collectionKey: string;
  productName: string;
  price: number;
};

const defualtNewCollectionAndDocForm: NewCollectionAndDocForm = {
  collectionKey: '',
  productName: '',
  price: 0,
};

const NavigationLinks = () => {
  return (
    
    <div className="top-16 w-full absolute z-30 sm:flex sm:visible hidden justify-center px-6 pb-4 ">

      <input type="checkbox" id="my-modal" className="modal-toggle" />

      <div className="container">
        <div className="navbar flex flex-col justify-center min-h-[20px] p-0">        
          <ul className="menu border-none outline-none rounded-none border-r-0 menu-horizontal px-1">
            <div className="px-3">
              <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black tracking-wide">
                BOY
              </Link>
            </div>
            <div className="px-3">
              <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black tracking-wide">
                GIRL
              </Link>
            </div>

            <div className="px-3">
              <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black tracking-wide">
                SHOP
              </Link>
            </div>
          </ul>
          <ul>
            <li>fsd</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavigationLinks;
