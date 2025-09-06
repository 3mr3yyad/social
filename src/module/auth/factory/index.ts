import { SYS_ROLE, USER_AGENT } from "../../../utils/common/enums";
import { generateHash } from "../../../utils/hash";
import { generateExpiryTime, generateOTP } from "../../../utils/OTP";
import { RegisterDto } from "../auth.dto";
import { User } from "../entity";

export class AuthFactoryService {
    register(registerDto:RegisterDto){
        const user = new User()
        user.fullName = registerDto.fullName as string
        user.phoneNumber = registerDto.phoneNumber as string
        user.email = registerDto.email
        user.password = generateHash(registerDto.password)
        user.role = SYS_ROLE.user
        user.gender = registerDto.gender
        user.userAgent = USER_AGENT.local
        user.otp = generateOTP()
        user.otpExpiry = generateExpiryTime(5 * 60 * 60 * 1000)
        user.cridentialsUpdatedAt = Date.now() as unknown as Date
        return user
    }
}
    
