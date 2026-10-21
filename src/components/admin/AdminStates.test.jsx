import {render,screen,fireEvent} from '@testing-library/react';
import {Loading,ErrorBox,ConfirmBox} from './AdminStates';
test('loading displays a useful label',()=>{
 render(<Loading/>);
 expect(screen.getByText('กำลังโหลด...')).toBeTruthy();
});
test('error supports retry',()=>{
 const retry=jest.fn();
 render(<ErrorBox error={new Error('offline')} onRetry={retry}/>);
 expect(screen.getByText('offline')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'ลองใหม่'}));
 expect(retry).toHaveBeenCalledTimes(1);
});
test('confirmation renders only when open and requires an explicit click',()=>{
 const confirm=jest.fn(),cancel=jest.fn();
 const {rerender}=render(<ConfirmBox open={false} title="ยืนยัน" onConfirm={confirm} onCancel={cancel}>ข้อความ</ConfirmBox>);
 expect(screen.queryByRole('dialog')).toBeNull();
 rerender(<ConfirmBox open title="ยืนยัน" onConfirm={confirm} onCancel={cancel}>ข้อความ</ConfirmBox>);
 expect(screen.getByRole('dialog')).toBeTruthy();
 expect(confirm).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'ยืนยัน'}));
 expect(confirm).toHaveBeenCalledTimes(1);
});
