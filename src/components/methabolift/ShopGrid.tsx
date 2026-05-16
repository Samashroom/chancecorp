import { useState, useEffect } from 'react';
import type { CollectionEntry } from 'astro:content';
import ShopCard from './ShopCard';
import './shop.css';

interface Props {
  items: CollectionEntry<'met'>[];
  itemsPerPage?: number;
}

export default function ShopGrid({ items, itemsPerPage = 12 }: Props) {
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = items.filter(item => 
    item.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayedItems = filteredItems.slice(0, visibleItems);
  const hasMore = visibleItems < filteredItems.length;
  
  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + itemsPerPage, filteredItems.length));
  };
  
  useEffect(() => {
    setVisibleItems(itemsPerPage);
  }, [searchTerm, itemsPerPage]);
  
  return (
    <div className="shop-container">
      <div className="search-section">
        
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {displayedItems.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">Товары не найдены</p>
        </div>
      ) : (
        <>
          <div className="shop-grid">
            {displayedItems.map((item) => (
              <ShopCard key={item.id} item={item} />
            ))}
          </div>
          
          {hasMore && (
            <div className="load-more-wrapper">
              <button
                onClick={loadMore}
                className="load-more-button"
              >
                Загрузить еще ({filteredItems.length - visibleItems} осталось)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}