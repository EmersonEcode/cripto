import React from "react";
import { TopStakingContainer } from "../../hooks/TopStakingData";
import styles from './staklist.module.css'

export const StakList = () => {
    return (
        <section className={styles.content}>
            <TopStakingContainer perPage={1} stakingQuatidade={100} titleDataLocalStoreged="topStak" typeFetch="all" styleContainerData={{
                display: 'grid',
                flexDirection: 'column',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: 30,
                alignSelf: 'center',
                padding: '2%',
                
                
            }} styleContainer={{padding: '2%', gap: 10, width: '100%'}} styleCard={{    
                width: '100%',
                display: 'flex' ,
                padding: '15px' ,
                flexDirection: 'column' ,
                justifyContent: 'space-between' ,
                border: 'solid 0.5px rgba(51, 48, 48, 1)' ,
                borderRadius: '10px' ,
                color: 'white' ,
                gap: '10px' ,
                height: ' 0 auto ',
                background: '#19191F'}}/>
        </section>
    )
}