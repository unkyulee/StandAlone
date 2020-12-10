// services
import data from "./data.service";
import event from "./event.service";

export default {    
    isAuthenticated: function() {        
        return sessionStorage.getItem("auth");
    },
    user: function() {
        let result = {};
        try {
            let s = sessionStorage.getItem("auth");
            result = JSON.parse(s);
        } catch {
            sessionStorage.removeItem("auth");
        }

        return result;
    },
    login: async function(_id, password) {
        // 
        let response = await data.get(
            "User", 
            `(x) => x._id == '${_id}' && x.password == hash('${password}')`,
            {
                sensitive: {
                    password: 1
                }
            }
        );
        if(response.data && response.data.length > 0) {
            sessionStorage.setItem("auth", JSON.stringify(response.data[0]));
            event.send({name: 'login-success'});
            return true;
        }
        return false;
    }
};
