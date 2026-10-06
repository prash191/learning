import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';

const TaskView = ({ tasks, isLoading, handleDeleteTask, handleUpdate }) => {
    return (
        <main className="list-section">
            <div className="list-heading">
                <div>
                    <span className="section-eyebrow">BEFORE YOU GO</span>
                    <h2>Your packing list</h2>
                </div>
                <span className="item-count">{tasks.length} {tasks.length === 1 ? "item" : "items"}</span>
            </div>
            {isLoading ? (
                <ul className="packing-list" aria-label="Loading packing list" aria-busy="true">
                    {Array.from({ length: 4 }, (_, index) => (
                        <li className="packing-item packing-item-skeleton" key={`task-skeleton-${index}`}>
                            <Skeleton variant="circular" width={17} height={17} />
                            <Skeleton variant="circular" width={28} height={28} />
                            <Skeleton className="skeleton-task-name" variant="text" height={24} />
                            <Skeleton variant="circular" width={32} height={32} />
                        </li>
                    ))}
                </ul>
            ) : tasks.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon" aria-hidden="true">✳</span>
                    <p>Your list is ready to take shape.</p>
                    <span>Add the first thing you don’t want to leave behind.</span>
                </div>
            ) : (
                <ul className="packing-list">
                    {tasks.map((task) => (
                        <li className={`packing-item${task.packed ? " is-packed" : ""}`} key={task._id}>
                            <label className="packing-item-main">
                                <input onChange={() => { handleUpdate(task) }} type="checkbox" checked={task.packed === true} />
                                <span className="quantity-badge">{task.quantity}</span>
                                <span className="packing-item-name">{task.item}</span>
                            </label>
                            <IconButton onClick={() => { handleDeleteTask(task) }} aria-label='Delete'><DeleteIcon /></IconButton>
                        </li>
                    ))}
                </ul>
            )}
        </main>

    )
}

export default TaskView
