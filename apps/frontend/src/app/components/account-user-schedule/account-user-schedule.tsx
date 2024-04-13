import { selectCurrentUser, useAppSelector } from '@2299899-fit-friends/frontend-core';

export default function AccountUserSchedule(): JSX.Element {
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <div className="personal-account-user__schedule">
      <form action="#" method="get">
        <div className="personal-account-user__form">
          <div className="personal-account-user__input">
            <label>
              <span className="personal-account-user__label">
                План на день, ккал
              </span>
              <input
                type="text"
                name="schedule-for-the-day"
                defaultValue={currentUser?.caloriesPerDay}
                disabled
              />
            </label>
          </div>
          <div className="personal-account-user__input">
            <label>
              <span className="personal-account-user__label">
                План на неделю, ккал
              </span>
              <input
                type="text"
                name="schedule-for-the-week"
                defaultValue={currentUser?.caloriesPerDay ? currentUser?.caloriesPerDay * 7 : ''}
                disabled
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
