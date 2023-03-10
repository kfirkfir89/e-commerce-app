import { Link, useParams } from 'react-router-dom';


type CategoryRouteParams = {
  category: string;
};

const LinkOptions = ({ title }: { title:string }) => {
  return (
    <div className="flex flex-col">
      <div>
        <Link to={title}>{title.toUpperCase()}</Link>
      </div>
      <div className="flex">
        <div>hats</div>
        <div>pants</div>
        <div>ass</div>
      </div>
    </div>
  );
};

export default LinkOptions;
