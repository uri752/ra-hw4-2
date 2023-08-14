import { getByTestId } from '@testing-library/react';
import { isFocusable } from '@testing-library/user-event/dist/utils';
import React from 'react'
import { useState } from 'react';


export default function Workout() {

    const [workouts, setWorkouts] = useState([]);
    const [form, setForm] = useState({date: '', distance: ''});
    
    const handleChange = event => {
        const {name, value} = event.target;
        setForm(prevForm => ({...prevForm, [name]: value}));
    }
    const handleSubmit = event => {            
            event.preventDefault();            
            
            const workout = {id: getNewId(workouts), date: form.date, distance: form.distance};
            
            let isFind = false;             

            for(let index = 0; index < workouts.length; ++index) {                    
                let prevWorkout = workouts[index];
                if (prevWorkout.date === workout.date) {
                    const newDistance = Number(workout.distance) + Number(prevWorkout.distance)                        
                    prevWorkout.distance = newDistance;    
                    isFind = true;                        
                }
            }
            
            let newWorkouts = [];
            if (isFind) {
                newWorkouts = workouts.sort(sortWorkouts);                        
            } else {
                newWorkouts = [...workouts, workout].sort(sortWorkouts);    
            }

            setWorkouts(newWorkouts);
            
            setForm({date: '', distance: ''});
    };     

    const sortWorkouts = (date1, date2) => {        
        if (date1.date > date2.date) return -1;
        if (date1.date < date2.date) return 1;
        return 0;
    }

    const handleDelete = id => {
        setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id != id));
    };

    const handleEdit = id => {
        const workout = workouts.find( el => el.id === id);
        setForm({date: workout.date, distance: workout.distance});
        handleDelete(id);
    }
    
    return(
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='date'>Дата (ДД.ММ.ГГ)</label>
                    <input type='date' id='date' name='date' value={form.date} onChange={handleChange} required></input>
                </div>                
                <div>
                    <label htmlFor='distance'>Пройдено км</label>
                    <input type='number' id='distance' name='distance' value={form.distance} onChange={handleChange} required></input>
                </div>

                <button type='submit'>OK</button>
            </form>

            <div className='workouts'>
                <ul className='workouts-headers'>
                    <li>Дата (ДД.ММ.ГГ)</li>
                    <li>Пройдено км</li>
                    <li>Действия</li>
                </ul>

                <ul className='workouts-data'>
                    {
                        workouts.map(workout => 
                            <li key={workout.id}>
                                <span>{workout.date}</span>
                                <span>{workout.distance}</span>
                                <div>
                                    <button onClick={ () => handleEdit(workout.id)}><i className='material-icons'>edit</i></button>
                                    <button onClick={ () => handleDelete(workout.id)}><i className='material-icons'>delete_forever</i></button>
                                </div>
                            </li>
                            )
                    }
                </ul>


            </div>
        </>
    )
}

function getNewId(arr) {    
    const el = arr.reduce( (prev, cur) => prev.id > cur.id ? prev : cur, {} );
    return el.id === undefined ? 1: Number(el.id) + 1;
}