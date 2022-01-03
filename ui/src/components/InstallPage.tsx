import { Button, TextField } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { MizuContext, Page } from "../App";
import { adminUsername } from "../consts";
import Api from "../helpers/api";
import { toast } from 'react-toastify';
import LoadingOverlay from "./LoadOverlay";

const api = new Api();

export const InstallPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const {setPage} = useContext(MizuContext);

    const onFormSubmit = async () => {
        setIsLoading(true);
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        } else if (password !== passwordConfirm) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await api.postInstall(password);
            if (!await api.isAuthenticationNeeded()) {
                toast.success("admin user created successfully");
                setPage(Page.Traffic);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }

    }

    return <div className="centeredForm">
            {isLoading && <LoadingOverlay/>}
            <p>Welcome to Mizu, please set up the admin user to continue</p>
            <TextField className="form-input" variant="standard" fullWidth value={adminUsername} disabled={true}/>
            <TextField className="form-input" label="Password" variant="standard" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)}/>
            <TextField className="form-input" label="Confirm Password" variant="standard" type="password" fullWidth value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}/>
            <Button className="form-button" variant="contained" fullWidth onClick={onFormSubmit}>Finish</Button>
    </div>;
};

export default InstallPage;
