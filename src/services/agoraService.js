import api from "../utils/api";

export const fetchAgoraTokens = async (classID, userID) => {

	const response = await api.post('/generate-agora-token', {
		class_id: classID,
		user_id: userID,
	});
	return response.data.data;
};

export const fetchCreateAttendanceOnJoin = async (classID, classType, userID) => {
	
	const response = await api.post('/create-attendance-onjoin', {
		class_id: classID,
		class_type: classType,
		user_id: userID,
	});
	return response.data.data;
}

export const fetchCreateAttendanceOnLeave = async (classID, classType, userID) => {
	
	const response = await api.post('/create-attendance-onleave', {
		class_id: classID,
		class_type: classType,
		user_id: userID,
	});
	return response.data.data;
}

export default {
	fetchAgoraTokens,
	fetchCreateAttendanceOnJoin,
	fetchCreateAttendanceOnLeave
};