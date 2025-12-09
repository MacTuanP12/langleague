import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { addFavorite, removeFavorite, checkFavorite } from '../services/favorite.service';

interface FavoriteButtonProps {
  chapterId: number;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'text' | 'link';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ chapterId, size = 'middle', type = 'default' }) => {
  const dispatch = useAppDispatch();
  const { favoriteMap, updating } = useAppSelector(state => state.favorite);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if favorite on mount
    dispatch(checkFavorite(chapterId));
  }, [chapterId]);

  useEffect(() => {
    setIsFavorite(favoriteMap[chapterId] || false);
  }, [favoriteMap, chapterId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(chapterId)).unwrap();
        message.success('Removed from favorites');
      } else {
        await dispatch(addFavorite(chapterId)).unwrap();
        message.success('Added to favorites');
      }
    } catch (error) {
      message.error('Failed to update favorites');
    }
  };

  return (
    <Button
      type={type}
      size={size}
      icon={<Heart size={16} color={isFavorite ? '#eb2f96' : undefined} fill={isFavorite ? '#eb2f96' : 'none'} />}
      onClick={handleToggle}
      loading={updating}
      style={{
        color: isFavorite ? '#eb2f96' : undefined,
      }}
    >
      {isFavorite ? 'Favorited' : 'Add to Favorites'}
    </Button>
  );
};

export default FavoriteButton;
