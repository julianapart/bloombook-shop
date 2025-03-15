
import { useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  title: string;
  imageSrc: string;
  link: string;
  className?: string;
  style?: CSSProperties;
}

const CategoryCard = ({ title, imageSrc, link, className, style }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg shadow-md card-hover",
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered && "scale-105"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 text-center">
        <h3 className="text-xl font-medium text-white mb-4">{title}</h3>
        <Link 
          to={link} 
          className="inline-block bg-white/90 hover:bg-white text-pink-700 px-4 py-2 rounded text-sm transition-all duration-300"
        >
          Shop Collection
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;
