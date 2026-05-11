import type { CollectionEntry } from 'astro:content';
import './shop.css';

interface Props {
  item: CollectionEntry<'met'>;
}

export default function ShopCard({ item }: Props) {
  const { title, description, image } = item.data;
  
  return (
    <div className="shop-card">
      <div className="card-image-wrapper">
        <img
          src={image}
          alt={title}
          className="card-image"
          loading="lazy"
        />
      </div>
      
      <div className="card-content">
        <h3 className="card-title">
          {title}
        </h3>
        
        <p className="card-description">
          {description}
        </p>
        
        <button 
          className="card-button"
          onClick={() => console.log(`Add to cart: ${title}`)}
        >
          Подробнее
        </button>
      </div>
    </div>
  );
}