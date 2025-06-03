import React from "react";
import styles from './top-staking.module.css';
import { FiChevronDown } from 'react-icons/fi';
import { StakingCard } from "./StakingCard/StakingCard";
import { TopStakingContainer } from "../../hooks/TopStakingData";
import { StakList } from "../StakList/Staklist";

export const TopStaking = () => {
    
    return (
        <section className={styles.content}>
            <section className={styles.header}>
                <div className={styles.title}>
                <div className={styles.description}><p>Moedas recomendadas nas ultimas 24 horas</p><span>3 ativos</span></div>
                <h2>Top Staking Ativos</h2>
                </div>
                
            </section>
            <TopStakingContainer perPage={3} typeFetch="top" titleDataLocalStoreged="topStak" styleContainerData={{
                display: 'flex',
                flexDirection: 'row',
                gap: 30,
                padding: '2%',
                width: '70%'
            }} styleContainer={{padding: '2%', gap: 10}} styleCard={{    
                width: '45%',
                display: 'flex' ,
                padding: '15px' ,
                flexDirection: 'column' ,
                justifyContent: 'space-between' ,
                border: 'solid 0.5px rgba(51, 48, 48, 1)' ,
                borderRadius: '10px' ,
                color: 'white' ,
                gap: '10px' ,
                height: '100% ',
                background: '#19191F'}} />
                
        </section>
    )
}