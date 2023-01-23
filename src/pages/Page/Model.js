import { isMobile } from "react-device-detect"

const SearchModel = [
    {
        label: "Người dùng",
        code: "fullname"
    },
    {
        label: "Tên đăng nhập",
        code: "username"
    },
    {
        label: "Email",
        code: "email"
    },
    {
        label: "Số điện thoại",
        code: "phone"
    },
    {
        label: "Nickname",
        code: "nickname"
    },
    {
        label: "Ngày tạo",
        code: "createdDate"
    },
    {
        label: "Ngày cập nhập",
        code: "updatedDate"
    },
    {
        label: "Người tạo",
        code: "createdBy"
    },
    {
        label: "Người cập nhập",
        code: "updatedBy"
    },
]

const ResultModel = [
    {
        label: "Người dùng",
        code: "fullname"
    },
    {
        label: "Tên đăng nhập",
        code: "username"
    },
    {
        label: "Email",
        code: "email"
    },
    {
        label: "Số điện thoại",
        code: "phone"
    },
    {
        label: "Nickname",
        code: "nickname"
    },
    {
        label: "Ngày tạo",
        code: "createdDate"
    },
    {
        label: "Ngày cập nhập",
        code: "updatedDate"
    },
    {
        label: "Người tạo",
        code: "createdBy"
    },
    {
        label: "Người cập nhập",
        code: "updatedBy"
    },
]

const defaultSearchModel = isMobile ? ["fullname", "phone"] : [
    "fullname",
    "username",
    "email",
    "phone",
    "nickname",
    "createdDate",
    "updatedDate",
    "createdBy",
    "updatedBy",
]
const defaultResultModel = isMobile ? ["fullname", "phone"] : [
    "fullname",
    "username",
    "email",
    "phone",
    "nickname",
    "createdDate",
    "updatedDate",
    "createdBy",
    "updatedBy",
]

export { SearchModel, ResultModel, defaultSearchModel, defaultResultModel }