import {useCallback} from "react"
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "qs"

export const useQueryState = (query) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const setQuery = useCallback(
        value => {
            const existingQueries = qs.parse(searchParams.toString(), {
                ignoreQueryPrefix: true,
            })

            const queryString = qs.stringify(
                {...existingQueries, [query]: value},
                {skipNulls: true}
            )

            router.push(`${pathname}?${queryString}`)
        },
        [router, pathname, query, searchParams]
    )

    return [
        qs.parse(searchParams.toString(), {ignoreQueryPrefix: true})[query],
        setQuery,
    ]
}