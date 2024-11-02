import { useState, useEffect, useCallback } from 'react';

const useInfiniteScroll = (initialItems, keyword, fetchData, containerRef) => {
    const [items, setItems] = useState(initialItems);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const loadMoreItems = useCallback(async () => {
        if (!isFetching) return;
        const newItems = await fetchData(keyword, page - 1);
        setItems(prevItems => [...prevItems, ...newItems]);
        setPage(prevPage => prevPage + 1);
        setHasMore(newItems.length > 20); 
        setIsFetching(false);
    }, [isFetching, fetchData, page, keyword]);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight - scrollTop <= clientHeight && hasMore && !isFetching) {
            setIsFetching(true);
        }
    }, [hasMore, isFetching, containerRef]);

    useEffect(() => {
        setItems(initialItems); 
        setPage(1);
        setHasMore(true);
        setIsFetching(true);
    }, [keyword]);

    useEffect(() => {
        loadMoreItems();
    }, [isFetching, loadMoreItems]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, containerRef]);

    return { items, hasMore };
};

export default useInfiniteScroll;
