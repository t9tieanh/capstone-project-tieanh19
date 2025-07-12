const Tag = ({children, className}) => {
    return (
        <>
            <span className={className || "badge bg-warning text-dark"}>{children}</span>
        </>
    )
}

export default Tag