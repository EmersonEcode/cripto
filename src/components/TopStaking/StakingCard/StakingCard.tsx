import React from "react";
import styles from './stakingcard.module.css'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { MiniChart } from "../MiniChart/MiniChart";
import { StakingRewardRate } from "../RewardRate/RewardRate";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import { formatPercentage } from "../../../utils/format";

export const StakingCard = ({logo, symbol, typeMechanism, nameCrypto, rewardRate, variation, price, id, style}) => {

    const renderVariation = (value) => {
    
        if(value < 0){
            return (
            <div className={styles.variationNegative}>
                <div className={styles.iconCircle}><BsArrowDownLeft color="black" size={8}/></div>{formatPercentage(value)}
                </div>
                )

        }else{
            return (
            <div className={styles.variationPositive}>
            <div className={styles.iconCircle}> <BsArrowUpRight color="black" size={10} fontWeight={'bold'}/></div>{formatPercentage(value)}
            </div>
            )
        }
    }

    return (
        <div style={style}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <img src={logo} alt={'logo da moeda'+ nameCrypto} />
                </div>
                <div className={styles.title}>
                    <span>{typeMechanism}</span>
                     <h3>{nameCrypto} ({symbol}) </h3>   
                </div>
                <div className={styles.moreDetails}>
                    <button></button>
                </div>
            </div>
            <div className={styles.description}>
                <div className={styles.rewardRate}>
                    
                    <div className={styles.rate}>
                        <span>Taxa de reconpensa</span>
                    <p>0,00</p>
                    </div>
                    <div className={styles.variation}>
                    {renderVariation(variation)}
                    </div>
                </div>
                <div className={styles.price}>
                    <span>Preço</span>
                    <p>{price}</p>
                </div>
            </div>
            <MiniChart coinId={id} />
        </div>
    )
}