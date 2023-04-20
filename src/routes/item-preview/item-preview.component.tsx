import { useParams } from 'react-router-dom';

export type ItemPreviewRouteParams = {
  item: string;
};
const ItemPreview = () => {
  const { item } = useParams<keyof ItemPreviewRouteParams>() as ItemPreviewRouteParams;

  return (
    <>
      <div className="text-3xl text-red-900">this is the new page</div>
      <div>{item}</div>
    </>
  );
};

export default ItemPreview;
