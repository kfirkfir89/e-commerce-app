import { memo, MouseEventHandler, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featchRemoveItem, selectAddFirebaseItems } from '../../store/add-firebase/add-firebase.reducer';
import { deleteImageUrls } from '../../utils/firebase/firebase.utils';
import { ColorImages, NewItemValues } from './add-item.component';


const AddItemsPreview = () => {
  const addFirebaseItems = useSelector(selectAddFirebaseItems);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const deleteItemHandler = (item: NewItemValues) => {
    setIsLoading(true);
    dispatch(featchRemoveItem(item));
    item.colorImagesUrls.map(async (colorImg) => (
      await deleteImageUrls(colorImg.itemUrlList)
    ));
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col p-1">
      {/* title */}
      <div className="flex justify-center text-xl text-gray-800 mb-2 font-semibold">Items</div>
      {/* items rendering */}
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-2">
        {addFirebaseItems.length > 0 && addFirebaseItems.map((item: NewItemValues) => {
          return (

            <div key={item.productName} className="flex flex-col rounded-lg pb-2 bg-gray-100 shadow-lg">
              {/* all the item data */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-1">
                  <label className="flex flex-wrap h-fit">
                    <span className="label-text ">Name: &nbsp;</span>
                    <span className="label-text font-semibold">{item.productName}</span>
                  </label>   
                  <label className="flex flex-wrap h-fit">
                    <span className="label-text ">Price: &nbsp;</span>
                    <span className="label-text font-semibold">{item.price}</span>
                  </label>   
                  <label className="flex flex-wrap h-fit">
                    <span className="label-text ">Colors: &nbsp;</span>
                    {
                    item.colors.map((c) => {
                      return (
                        <div key={c.label} className={`${c.value} h-3 w-3 rounded-sm mt-1 mr-1`} />
                      );
                    })
                  }
                  </label>
                  <label className="flex flex-wrap h-fit">
                    <span className="label-text ">Sizes: &nbsp;</span>
                    {
                    item.sizes.map((s) => {
                      return (
                        <span key={s.label} className="label-text font-semibold whitespace-nowrap">
                          {`${s.label}`}
                          {' '}
                          &nbsp;
                        </span>
                      );
                    })
                  }
                  </label>
                  <label className="flex flex-wrap h-fit">
                    <span className="label-text ">Date: &nbsp;</span>
                    <span className="label-text font-semibold">
                      {/* {`${item.created.toString().slice(0, 10).replace(/-/g, '-').split('-')
                      .reverse()
                      .join('/')}`} */}
                      {`${item.created.toDate().toLocaleString().slice(0, 10).replace(/-/g, '-')
                        .replace(',', '')
                        .split('-')
                        .reverse()
                        .join('/')}`}
                    </span>
                  </label>
                  <label className="flex flex-wrap h-fit col-span-2">
                    <span className="label-text ">Details: &nbsp;</span>
                    <span className="label-text font-semibold">{`${item.details}`}</span>
                  </label>
                </div>
              </div>
              {/* images rendering by each color */}
              <figure className="flex flex-col sm:mx-2">
                <label className="flex p-1 h-fit justify-center">
                  <span className="label-text">Images</span>
                </label>   
                <div className="flex justify-center flex-wrap rounded-lg ">
                  {
                  item.colorImagesUrls.map((colorImg) => {
                    return (
                      <div key={colorImg.color} className={`h-32 min-h-max m-1 p-1 carousel carousel-vertical rounded-lg ${item.colors.find((c) => c.label === colorImg.color)?.value}`}>
                        {
                          colorImg.itemUrlList.map((img) => {
                            return (
                              <div key={img} className="carousel-item justify-center h-34 bg-white">
                                <img className="h-32" src={img} alt={img} />
                              </div>
                            );
                          })
                        }
                      </div>
                    );
                  })     
                }

                </div>
              </figure>
              <div className="md:col-span-3 flex flex-col w-full">
                <div className="border-t border-gray-700 m-2 opacity-30"></div>
                <div className="flex justify-end">
                  <button type="button" className={`btn btn-accent ${isLoading ? 'loading' : ''} mx-2 btn-xs text-gray-700`} onClick={() => { deleteItemHandler(item); }}>Delete</button>
                </div>
              </div>
            </div>

          );
        })}
      </div>
    </div>
  );
};

export default memo(AddItemsPreview);
