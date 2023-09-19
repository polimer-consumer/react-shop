import {useCallback} from "react"
import {useLocation} from "react-router-dom"
import {useRouter} from "next/navigation";
import qs from "qs"

export const useQueryState = (query) => {
    const location = useLocation();
    const router = useRouter();

    const setQuery = useCallback(
        value => {
            const existingQueries = qs.parse(location.search, {
                ignoreQueryPrefix: true,
            })

            const queryString = qs.stringify(
                {...existingQueries, [query]: value},
                {skipNulls: true}
            )

            router.push(`${location.pathname}?${queryString}`)
        },
        [router, location, query]
    )

    return [
        qs.parse(location.search, {ignoreQueryPrefix: true})[query],
        setQuery,
    ]
}