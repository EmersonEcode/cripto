import React, { act, useState } from "react";
import styles from './sidebar.module.css';
import { MdDashboard, MdAccountBalanceWallet, MdInsertChart, MdSwapHoriz, MdSettings, MdHelp } from 'react-icons/md'; // Material Icons
import { useNavigate } from "react-router-dom";

const menuOptions = [
    {
        id: 1,
        name: 'Dashboard',
        icon: <MdDashboard className={styles.icon} size={25} />,
        action: '/dashboard'
    },
    {
        id: 2,
        name: 'Ativos',
        icon: <MdAccountBalanceWallet className={styles.icon} size={25} />,
        action: '/staks'
    },
    


]
    
    
export const SideBar = () => {
    const[isActive, setActive] = useState<string | null>('/dashboard')
    const navigate = useNavigate();
        const handleNavigate = (route) => {
        setActive(route)
        navigate(route);
        };
    return(
        <aside className={styles.menuSide}>
            <ul className={styles.listOptions}>
                {
                    menuOptions.map((item, index) => {
                    const isActiveItem = isActive === item.action;
                    return (
                        <li onClick={ () => handleNavigate(item.action) ?? '/Dashboard'} key={index} className={`${styles.li} ${isActiveItem ? styles.active: ''} `}>{item.icon}{item.name}</li> 
                    )
                    })
                    
                }
            </ul>
        </aside>
    )
}   