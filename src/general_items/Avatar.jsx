function Avatar({user, style}) {
    return(
        <div style={{background: user.color, display: "flex", borderRadius: "50%", width: "100%", height: "100%", fontSize: 30, ...style}}>
            <span style={{margin: "auto"}}>{user.shortName}</span>
        </div>
    )
}

export default Avatar;