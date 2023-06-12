import { PictureOutlined, CommentOutlined, InfoCircleOutlined, BorderBottomOutlined, BorderLeftOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity, faTrafficLight } from '@fortawesome/free-solid-svg-icons'

export const routeKeys = {
    "/": "1",
    "/location": "2",
    "/campaign": "3",
    "/city": "4",
    "/brand": "5",
    "/rider": "6",
}

export const locationTabs = [
    {
        Icon: InfoCircleOutlined,
        text: "About",
    },
    {
        Icon: PictureOutlined,
        text: "Photos",
    },
    {
        Icon: CommentOutlined,
        text: "Reviews",
    },
]

export const locationAbouts = (location) => [
    {
        Icon: <FontAwesomeIcon icon={faTrafficLight} color="gray" />,
        text: location.trafic_flow,
    },
    {
        Icon: <FontAwesomeIcon icon={faCity} color="gray" />,
        text: location.city,
    },
    {
        Icon: <BorderBottomOutlined />,
        text: location.width+ " "+"FT",
    },
    {
        Icon: <BorderLeftOutlined />,
        text: location.height+ " "+"FT",
    },
]