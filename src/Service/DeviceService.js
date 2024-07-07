import axios from 'axios';

const DEVICE_API_BASE_URL = "http://localhost:8082/api/device";

class DeviceService {

    getDevices(){
        return axios.get(DEVICE_API_BASE_URL);
    }

    deleteDevice(deviceId){
        return axios.delete(DEVICE_API_BASE_URL + '/' + deviceId);
    }

}

export default new DeviceService()