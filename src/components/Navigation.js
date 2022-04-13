const Navigation = () => {
    const navigation = [
        { name: 'Portfolio', href: '#' },
        { name: 'Profit / Loss', href: '#' },
        { name: 'Settings', href: '#' }
    ]
    return (
        <div className="py-4 flex justify-center space-x-6">
            {navigation.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center text-base font-medium text-black5 dark:text-white3 px-4 h-10 hover:bg-white4 dark:hover:bg-black3 rounded-md">
                    {link.name}
                </a>
            ))}
        </div>
    )
}

export default Navigation