export const generateOTP = ():string => {
    return Math.floor(Math.random() * 90000 + 10000).toString()
}

export const generateExpiryTime = (time:number):Date => {
    return new Date(Date.now() + time)
}
