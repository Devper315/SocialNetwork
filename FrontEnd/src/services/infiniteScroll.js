export const handleScroll = (event, loadMore) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight) {
        
        loadMore();
    }
};

export const handleScrollReverse = (event, loadMore) => {
    const { scrollTop } = event.target;
    if (scrollTop === 0) {
        loadMore();
        
    }
}