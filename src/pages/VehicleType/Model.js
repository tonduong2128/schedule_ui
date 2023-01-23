import { isMobile } from "react-device-detect"

const SearchModel = [
    {
        label: "Tên",
        code: "name"
    },
    {
        label: "Mô tả",
        code: "description"
    },
    {
        label: "Giáo viên",
        code: "teacher"
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
        label: "Tên",
        code: "name"
    },
    {
        label: "Mô tả",
        code: "description"
    },
    {
        label: "Giáo viên",
        code: "teacher"
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

const defaultSearchModel = isMobile ? ["name", "description"] : [
    "name",
    "description",
    "teacher",
    "createdDate",
    "updatedDate",
    "createdBy",
    "updatedBy",
]
const defaultResultModel = isMobile ? ["name", "description"] : [
    "name",
    "description",
    "teacher",
    "createdDate",
    "updatedDate",
    "createdBy",
    "updatedBy",
]

export { SearchModel, ResultModel, defaultSearchModel, defaultResultModel }