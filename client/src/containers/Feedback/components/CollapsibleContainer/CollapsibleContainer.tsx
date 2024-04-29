import { useState } from 'react';
import style from './CollapsibleContainer.module.css';
import RatingStars from '../RatingStars/RatingStars';

interface CollapsibleContainerProps {
    id: number;
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    fcategory: string;
    experience: string;
    friendliness: string;
    quality: string;
    recommended: string;
    q1: string;
    q2: string;
    q3: string;
    image: string;
    created_at: string;
    status: string;
}

const CollapsibleContainer: React.FC<CollapsibleContainerProps> = ({
    id,
    name,
    age,
    gender,
    phone,
    email,
    fcategory,
    experience,
    friendliness,
    quality,
    recommended,
    q1,
    q2,
    q3,
    image,
    created_at,
    status,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
        const isHeaderClicked = e.target === e.currentTarget.querySelector(`.${style.collapsibleHeader}`);
        
        if (isHeaderClicked) {
            setIsOpen(false);
        }
        
        e.stopPropagation();
    };

    const personalDetails = [
        { key: "1", label: "Name", children: name },
        { key: "2", label: "Age", children: String(age) },
        { key: "3", label: "Gender", children: gender },
        { key: "4", label: "Phone", children: phone },
        { key: "5", label: "Email", children: email },
    ];

    const ratings = [
        { key: "1", label: "Category", children: fcategory },
        { key: "2", label: "Experience", children: experience },
        { key: "3", label: "Friendliness", children: friendliness },
        { key: "4", label: "Quality", children: quality },
        { key: "5", label: "Recommended", children: recommended },
    ];

    const comments = [
        { key: "1", label: "Q1", children: q1 },
        { key: "2", label: "Q2", children: q2 },
        { key: "3", label: "Q3", children: q3 },
        { key: "4", label: "Screenshot", children: image },
    ];

    return (
        <div className={style.collapsibleContainer}>
            <div
                className={`${style.collapsibleContent} ${isOpen ? style.opened : style.notOpened}`}
                onClick={toggleOpen}
            >
                <div className={style.collapsibleHeader}>
                    <h2>ID: {id}</h2>
                    <h2>Name: {name}</h2>
                    <h2>Status: {status}</h2>
                    <h2>Date: {created_at}</h2>
                    <div className={style.expandIcon}>
                        {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
                    </div>
                </div>
                
                {isOpen && (
                    <div className={style.collapsibleContent} onClick={closeForm}>
                        <div className={style.collapsiblebox}>
                            <div className={style.personalDetails}>
                                <h3>Personal Details</h3>
                                {personalDetails.map((detail) => (
                                    <div key={detail.key} className={style.personalDetailsItem}>
                                        <span className={style.personalDetailsLabel}>{detail.label}: </span>
                                        <span className={style.personalDetailsContent}>{detail.children}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={style.ratings}>
                                <h3>Ratings</h3>
                                {ratings.map((rating) => (
                                <div key={rating.key} className={style.ratingsItem}>
                                    <span className={style.ratingsLabel}>{rating.label}{rating.label === 'Experience' || rating.label === 'Friendliness' || rating.label === 'Quality' || rating.label === 'Recommended' ? '' : ':'} </span>
                                    <span className={style.ratingsContent}>
                                        {rating.label === 'Experience' || rating.label === 'Friendliness' || rating.label === 'Quality' || rating.label === 'Recommended' ?
                                            <RatingStars rating={parseInt(rating.children)} />
                                            : rating.children
                                        }
                                    </span>
                                </div>
                            ))}
                            </div>
                            <div className={style.comments}>
                                <h3>Comments</h3>
                                {comments.map((comment) => (
                                    <div key={comment.key} className={style.commentsItem}>
                                        <span className={style.commentsLabel}>{comment.label}: </span>
                                        <span className={style.commentsContent}>{comment.children}</span>
                                    </div>
                                ))}
                            </div>
                            {/* <div className={style.status}>
                                <h3>Status</h3>
                                <span>{status}</span>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollapsibleContainer;
