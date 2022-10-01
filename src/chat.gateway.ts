import { WebSocketServer, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

export const users=[];

// to tell nest it is an socket implementation
//80,{namespace:'chat'}  80 port number ha ar namespace specify krne k liye ais gateway ko
@WebSocketGateway()
export class ChatGateway {
     
    // to acess the server we use this decorator
    @WebSocketServer()
    server;

    // we want to broadcast to all listeners so we handle messages here

    @SubscribeMessage('message')//name of event is message ais k age object jis ma message hota wo use krte
    handleMessage(@MessageBody() message: any): void {
        //the message just extracts message
        const user=users.filter((u)=>u.name==message.to)[0]
        //after connecting the users in the conn section the users are added in the above users array after that here we filter them 
        // and send send msg to only the user given in text form to make private convo
        this.server.to(user.id).emit('message', message.text);

        //this will handle socket messages
    }


    @SubscribeMessage('conn')//name of event is message ais k age object jis ma message hota wo use krte
    handleMessagee( client:Socket,user: any): void {
        //the message just extracts message
        users.push({id:client.id,name:user.name})
        console.log(users)
        this.server.emit('message', `${user.name} connected`);

        //this will handle socket messages
    }



}



