'use client'

import {Fragment, useEffect, useState} from 'react'
import {Dialog, Disclosure, Listbox, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {ArrowsUpDownIcon, ChevronUpDownIcon, FunnelIcon, MinusIcon, PlusIcon} from '@heroicons/react/20/solid'
import Product from "@/components/Product";
import {useQueryState} from "@/hooks/useQueryState";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const sortOptions = [
    {name: 'Most Popular', value: 'popular', current: true},
    {name: 'Best Rating', value: 'rating', current: false},
    {name: 'Newest', value: 'newest', current: false},
    {name: 'Price: Low to High', value: 'priceup', current: false},
    {name: 'Price: High to Low', value: 'pricedown', current: false},
]
const subCategories = [
    {name: 'LPs', href: '#'},
    {name: 'EPs', href: '#'},
    {name: 'Collections', href: '#'},
    {name: 'Singles', href: '#'},
    {name: 'Accessories', href: '#'},
]
const filters = [
    {
        id: 'years',
        name: 'Years',
        options: [
            {value: '60s', label: '60s', checked: false},
            {value: '70s', label: '70s', checked: false},
            {value: '80s', label: '80s', checked: true},
            {value: '90s', label: '90s', checked: false},
            {value: '2000s', label: '2000s', checked: false},
            {value: '2010s', label: '2010s', checked: false},
            {value: 'modern', label: 'Modern', checked: false},
        ],
    },
    {
        id: 'genre',
        name: 'Genre',
        options: [
            {value: 'metal', label: 'Metal', checked: false},
            {value: 'pop', label: 'Pop', checked: false},
            {value: 'jazz', label: 'Jazz', checked: false},
            {value: 'folk', label: 'Folk', checked: false},
            {value: 'punk', label: 'Punk', checked: false},
            {value: 'hip-hop', label: 'Hip-Hop', checked: false},
            {value: 'rock', label: 'Rock', checked: false},
        ],
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ContentPage() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [products, setProducts] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [years, setYears] = useQueryState("years");
    const [genre, setGenre] = useQueryState("genre");
    const [sort, setSort] = useQueryState("sort");
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetch(`/api/products?${searchParams.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data)
                setLoading(false)
            })
    }, [searchParams]);

    const isChecked = (sectionName, value) => {
        if (sectionName === "years") {
            return years?.includes(value);
        } else if (sectionName === "genre") {
            return genre?.includes(value);
        }
    };

    const handleFilterChange = async (event) => {
        if (event.target.name === 'years') {
            if (isChecked(event.target.name, event.target.value)) {
                const newQuery = years.replace(`${event.target.value};`, "");
                await setYears(newQuery);
            } else {
                const newQuery = (years) ?
                    years + `${event.target.value};` :
                    `${event.target.value};`;
                await setYears(newQuery);
            }
        } else if (event.target.name === 'genre') {
            if (isChecked(event.target.name, event.target.value)) {
                const newQuery = genre.replace(`${event.target.value};`, "");
                await setGenre(newQuery);
            } else {
                const newQuery = (genre) ?
                    genre + `${event.target.value};` :
                    `${event.target.value};`;
                await setGenre(newQuery);
            }
        }
    };

    const emptyQuery = async () => {
        router.push(pathname);
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25"/>
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel
                                    className="relative ml-auto flex h-full w-full max-w-xs
                                    flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center
                                            justify-center rounded-md bg-white p-2 text-gray-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4 border-t border-gray-200">
                                        <h3 className="sr-only">Categories</h3>
                                        <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                                            {subCategories.map((category) => (
                                                <li key={category.name}>
                                                    <a href={category.href} className="block px-2 py-3">
                                                        {category.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>

                                        {filters.map((section) => (
                                            <Disclosure as="div" key={section.id}
                                                        className="border-t border-gray-200 px-4 py-6">
                                                {({open}) => (
                                                    <>
                                                        <h3 className="-mx-2 -my-3 flow-root">
                                                            <Disclosure.Button
                                                                className="flex w-full items-center justify-between
                                                                bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                                <span
                                                                    className="font-medium text-gray-900">
                                                                    {section.name}
                                                                </span>
                                                                <span className="ml-6 flex items-center">
                                                                    {open ? (
                                                                        <MinusIcon className="h-5 w-5"
                                                                                   aria-hidden="true"/>
                                                                    ) : (
                                                                        <PlusIcon className="h-5 w-5"
                                                                                  aria-hidden="true"/>
                                                                    )}
                                                                </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <Disclosure.Panel className="pt-6">
                                                            <div className="space-y-6">
                                                                {section.options.map((option, optionId) => (
                                                                    <div key={option.value}
                                                                         className="flex items-center">
                                                                        <input
                                                                            id={`filter-${section.id}-${optionId}`}
                                                                            name={section.id}
                                                                            value={option.value}
                                                                            type="checkbox"
                                                                            checked={
                                                                                isChecked(section.id, option.value) ||
                                                                                false
                                                                            }
                                                                            onChange={handleFilterChange}
                                                                            className="h-4 w-4 rounded border-gray-300
                                                                            text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`filter-mobile-${section.id}-${optionId}`}
                                                                            className="ml-3 min-w-0 flex-1 text-gray-500"
                                                                        >
                                                                            {option.label}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        ))}
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

                        <div className="flex items-center">
                            <button
                                className="group inline-flex justify-center text-sm
                                shadow-2xl ring-1 ring-black ring-opacity-5 bg-white mx-4
                                px-4 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900"
                                onClick={emptyQuery}
                            >
                                Reset filters
                                <XMarkIcon
                                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0
                                            text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true">
                                </XMarkIcon>
                            </button>
                            <Listbox as="div" className="relative inline-block text-left
                            shadow-2xl ring-1 ring-black ring-opacity-5 bg-white px-4 py-1 rounded-md">
                                <div>
                                    <Listbox.Button
                                        className="group inline-flex justify-center text-sm
                                        font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        <ArrowsUpDownIcon
                                            className="-ml-3 mr-3 h-5 w-5 flex-shrink-0
                                            text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true">
                                        </ArrowsUpDownIcon>
                                        {sortOptions.find(option => option.value === sort)?.name || "Sort by"}
                                        <ChevronUpDownIcon
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0
                                            text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true">
                                        </ChevronUpDownIcon>
                                    </Listbox.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Listbox.Options
                                        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md
                                        bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    >
                                        {sortOptions.map((option) => (
                                            <Listbox.Option
                                                key={option.value}
                                                value={option.name}
                                            >
                                                {({active}) => (
                                                    <a
                                                        className={classNames(
                                                            sort === option.value ?
                                                                'font-medium text-gray-900' :
                                                                'text-gray-500',
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                        onClick={() => setSort(option.value)}
                                                    >
                                                        {option.name}
                                                    </a>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </Listbox>

                            <button
                                type="button"
                                className="-m-2 ml-4 p-2 text-gray-400
                                hover:text-gray-500 sm:ml-6 lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true"/>
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">

                            {/* Filters */}
                            <form className="hidden lg:block">
                                <h3 className="sr-only">Categories</h3>
                                <ul role="list"
                                    className="space-y-4 border-b
                                    border-gray-200 pb-6 text-sm font-medium text-gray-900">
                                    {subCategories.map((category) => (
                                        <li key={category.name}>
                                            <a href={category.href}>{category.name}</a>
                                        </li>
                                    ))}
                                </ul>

                                {filters.map((section) => (
                                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                                        {({open}) => (
                                            <>
                                                <h3 className="-my-3 flow-root">
                                                    <Disclosure.Button
                                                        className="flex w-full items-center justify-between
                                                        bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                        <span
                                                            className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className="pt-6">
                                                    <div className="space-y-4">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={section.id}
                                                                    value={option.value}
                                                                    type="checkbox"
                                                                    checked={
                                                                        isChecked(section.id, option.value) ||
                                                                        false
                                                                    }
                                                                    onChange={handleFilterChange}
                                                                    className="h-4 w-4 rounded border-gray-300
                                                                    text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                    className="ml-3 text-sm text-gray-600"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </form>

                            {/* Product grid */}
                            <div className="lg:col-span-3">
                                <div className="mt-2 grid grid-cols-1 gap-x-6
                                gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
                                    {products.map((product) => {
                                            return (
                                                <Product key={product._id} item={{
                                                    productId: product._id,
                                                    image: product.image,
                                                    genre: product.genre,
                                                    price: product.price,
                                                    album: product.album,
                                                    artist: product.artist
                                                }}/>
                                            )
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
