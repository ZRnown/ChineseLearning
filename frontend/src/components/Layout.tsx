import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Footer from './Footer';

const navigation = [
    { name: '首页', href: '/', current: true },
    { name: '古籍库', href: '/classics', current: false },
    { name: '古文翻译', href: '/translation', current: false }, // 添加古文翻译导航项
    { name: '我的收藏', href: '/favorites', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

// 修改 Layout 组件，添加 Footer
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-paper-texture flex flex-col">
            <Disclosure as="nav" className="bg-white/80 backdrop-blur-sm shadow-ink">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between">
                                <div className="flex">
                                    <div className="flex flex-shrink-0 items-center">
                                        <span className="text-2xl font-serif text-bamboo-600">
                                            中国古典文学
                                        </span>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current
                                                        ? 'border-bamboo-500 text-bamboo-600'
                                                        : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-700',
                                                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="-mr-2 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-500">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'border-bamboo-500 bg-bamboo-50 text-bamboo-700'
                                                : 'border-transparent text-ink-600 hover:border-ink-300 hover:bg-ink-50 hover:text-ink-800',
                                            'block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}