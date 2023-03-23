import NextImage from "next/image"
import { useRouter } from "next/router"
import NextLink from "next/link"
import axios from "axios"
import { toast } from "react-toastify"
import ParticipateButton from "../ParticipateButton"
import { SessionsDTO, EventsDTO } from "../../types"

type Props = {
    event: EventsDTO
    sessions: SessionsDTO[]
}
const Sessions = ({ event, sessions }: Props) => {
    const router = useRouter()
    const LOGGED_IN_USER_ID = 1

    const makeToast = (isSuccess: boolean, message: string) => {
        if (isSuccess) {
            toast.success(message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            })
        } else {
            toast.error(message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            })
        }
    }

    const handleAddFavorite = async (sessionId: number) => {
        await axios
            .post("/api/addFavoriteSession", {
                session_id: sessionId,
                user_id: LOGGED_IN_USER_ID
            })
            .then((res) => {
                if (res.data === "Session favorited") {
                    makeToast(true, "This session is now bookmarked.")
                    router.push(router.asPath)
                }
            })
            .catch((err) => {
                console.log(err)
                makeToast(false, "Error")
            })
    }

    const handleRemoveFavorite = async (favoritedSessionId: number) => {
        await axios
            .post("/api/removeFavoriteSession", {
                id: favoritedSessionId
            })
            .then((res) => {
                if (res.status === 200) {
                    makeToast(true, "This session is no longer bookmarked.")
                    router.push(router.asPath)
                }
            })
            .catch((err) => {
                console.log(err)
                makeToast(false, "Error")
            })
    }

    return (
        <div className="w-full flex flex-col items-start py-[2px] gap-[16px] rounded-[16px]">
            {sessions.map((item, index) => (
                <div className="w-full" key={index}>
                    <div className="bg-[#1C2928] w-full flex flex-row items-center rounded-[8px]">
                        <p className="text-white py-[8px] px-[16px]">{item.startTime.slice(0, -3)}</p>
                    </div>

                    <div className="w-full flex flex-col items-start gap-[32px] bg-[#FCFFFE]] rounded-[16px] p-[16px]">
                        <div className="w-full flex flex-row justify-between items-center gap-[67px]]">
                            <div className="flex flex-row items-center gap-[16px]">
                                <NextLink href={`/event/${event.id}/session/${item.id}`}>
                                    <h3 className="text-lg text-[#424242] font-[600] text-[24px] border-b border-[#52B5A4] cursor-pointer">
                                        {item.name}
                                    </h3>
                                </NextLink>
                                <NextImage
                                    className="text-[#91A8A7] cursor-pointer"
                                    src={
                                        item.favoritedSessions.length > 0
                                            ? "/vector-bookmark2.svg"
                                            : "/vector-bookmark.svg"
                                    }
                                    alt="vector-bookmark"
                                    width={24}
                                    height={24}
                                    onClick={() => {
                                        if (item.favoritedSessions.length > 0) {
                                            handleRemoveFavorite(item.favoritedSessions[0].id)
                                        } else {
                                            handleAddFavorite(item.id)
                                        }
                                    }}
                                />
                            </div>
                            <ParticipateButton event={event} session={item} isTallButton={false} />
                        </div>
                        <div className="w-full flex flex-row gap-[32px] justify-between items-center">
                            <div className="flex flex-row items-start gap-[8px]">
                                {item.team_members?.map((organizer: any, key: any) => (
                                    <div
                                        className="flex flex-row items-center bg-[#E4EAEA] py-[4px] px-[8px] gap-[8px] text-sm rounded-[4px]"
                                        key={key}
                                    >
                                        {organizer.role === "Speaker" && (
                                            <NextImage
                                                src={"/user-icon-6.svg"}
                                                alt="user-icon-6"
                                                width={24}
                                                height={24}
                                            />
                                        )}
                                        {organizer.role === "Organizer" && (
                                            <NextImage
                                                src={"/user-icon-4.svg"}
                                                alt="user-icon-6"
                                                width={24}
                                                height={24}
                                            />
                                        )}
                                        <p className="text-[#1C2928] font-[400] text-[16px]">
                                            {organizer.role}:{" "}
                                            <span className="font-[600] capitalize">{organizer.name}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row items-end gap-[32px] text-sm">
                                <div className="flex flex-row items-center gap-[8px]">
                                    <NextImage src={"/vector-clock.svg"} alt="vector-clock" width={16} height={16} />
                                    <p className="text-[#708E8C] text-[18px]">
                                        {/* {item.startTime.slice(0, -3)}-{item.endTime.slice(0, -3)} */}
                                        {item.startTime.slice(0, -3)}
                                    </p>
                                </div>
                                <div className="flex flex-row items-center gap-[8px] border-b border-[#708E8C] text-[#708E8C]">
                                    <NextImage src={"/vector-location.svg"} alt="location" width={15} height={15} />
                                    <p className="text-[18px]">{item.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default Sessions
