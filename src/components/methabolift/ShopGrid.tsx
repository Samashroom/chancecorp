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
        <h2 className="shop-title">
          Наши товары
          <span className="item-count">
            ({filteredItems.length} {filteredItems.length === 1 ? 'товар' : 'товаров'})
          </span>
        </h2>
        
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg
            className="search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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