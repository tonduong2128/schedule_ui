const RESPONSE_CODE = {
    ERROR: 0,
    SUCCESS: 1,
    ERROR_EXTERNAL: 2,
    RESERVATION_EXISTS: 3,
    RESERVATION_TIME_NOT_VALID: 4,
    AUTHORIZATION_FAILD: 5,
    TOKEN_EXPIRED: 6,
    RESERVATION_EXISTS_USER: 7,
    USERNAME_OR_PASSWORD_NOT_MATCH: 8,
    OLD_PASSWORD_NOT_MATCH: 9,
    USER_HAD_USED: 10,
    USER_EXPIRED: 11,
    NO_PERMISSION: 12,
}
const SALT_ROUNDS = 10;

const PER_PAGE = 10;

const ROLE = {
    admin: 1,
    teacher: 2,
    student: 3,

    teacher_vip: 4,
}
const ROLE_LABLE = {
    admin: "Admin",
    teacher: "Giáo viên",
    student: "Học sinh",
    teacher_vip: "Giáo viên(năm)",
}

const STATUS_USER = {
    using: 1,
    exprid: 2,
}

const STATUS_RESERVATION = {
    new: 1,
    approval: 2,
    reject: 3,
}

const TYPEOF_SPECIFIC_SCHEDULE = {
    BUSY: 0,
    UNBUSY: 1
}

const PASSWORD_DEFAULT = "123456";

export { RESPONSE_CODE, SALT_ROUNDS, PER_PAGE, ROLE, STATUS_USER, STATUS_RESERVATION, ROLE_LABLE, PASSWORD_DEFAULT, TYPEOF_SPECIFIC_SCHEDULE }