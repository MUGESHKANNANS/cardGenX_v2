import { StudentCardProps } from '../types';

export const StudentCard = ({ student }: StudentCardProps) => (
  <div className="border border-gray-800 hover:shadow-lg transition-shadow duration-200">
    <div className="flex h-full">
      <div className="w-1/3 bg-pink-200 flex flex-col justify-center items-center border-r border-gray-800 p-2">
        <div className="writing-vertical-lr transform rotate-180 text-center font-bold text-m">
          {student['AD NO']}
          <br />
          {student.Batch}
        </div>
      </div>
      <div
        className="w-2/3 bg-green-50 p-2 py-5 text-m"
        style={{
          fontFamily: 'Bookman Old Style, Georgia, Times New Roman, serif',
        }}
      >
        <div className="font-bold text-m leading-7">
          {student['Student Name']}
          <br />
          {student.Quota}/ {student.Dept}
          <br />
          {student.COMM}/ {student.TYPE || ''}
        </div>
      </div>
    </div>
  </div>
);