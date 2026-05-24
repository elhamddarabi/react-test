import React from "react";

function Pagination({ currentPage, totalPages, onePageChange }) {
    const pageNumber = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumber.push(i);
    }

    const handleprevious = () => {
        if (currentPage > 1) {
            onePageChange(currentPage - 1);
        }
    };

    // Define handleNext function here
    const handleNext = () => {
        if (currentPage < totalPages) {
            onePageChange(currentPage + 1);
        }
    };

    return (
        <div className="bt-back">
            <button
                onClick={handleprevious}
                disabled={currentPage === 1}
                className="bt-bt-back"
                style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
                قبلی
            </button>

            {pageNumber.map(num => (
                <button 
                className="bt-cbu"
                    key={num}
                    onClick={() => onePageChange(num)}
                    style={{
                        margin: '0 5px',
                        padding: '8px 12px',
                        fontWeight: currentPage === num ? 'bold' : 'normal',
                        backgroundColor: currentPage === num ? '#a3876dff' : '#f0f0f0', // استفاده از رنگ دلخواه
                        color: currentPage === num ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {num}
                </button>
            ))}

            <button
                className="bt-next"
                onClick={handleNext} // Now handleNext is defined and will be called
                disabled={currentPage === totalPages}
                style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
               بعدی
            </button>
        </div>
    );
}

export default Pagination;
