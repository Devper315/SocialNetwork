import React, { useEffect, useState } from "react";

const useInfiniteScroll = (loadMore, args=[], hasMore, containerRef) => {
    const [isFetching, setIsFetching] = useState(false)

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target
        if (scrollHeight - scrollTop === clientHeight && hasMore) {
            setIsFetching(true)
        }
    }

    useEffect(() => {
        if (!containerRef.current) return
        const element = containerRef.current
        element.addEventListener('scroll', handleScroll)
    }, [containerRef])

    useEffect(() => {
        if (!isFetching || !hasMore) return
        loadMore(...args)
        setIsFetching(false)
    }, [hasMore, isFetching, loadMore])
    return [isFetching, setIsFetching]

}

export default useInfiniteScroll