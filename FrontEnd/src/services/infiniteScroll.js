export const handleScroll = (event, loadMore) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight) {
        loadMore();
    }
};