import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(req : Request){
    const {email} = await req.json()

    try{
        const user = await prisma.user.findUnique({
            where : {
                email : String(email)
            }   
        })

        if(user){
            console.log(`role : ${user.role} id : ${user.id}`)
            return NextResponse.json({
                role : user.role,
                hostId : user.id
            })
        }
        return NextResponse.json({
            message : "user not found"
        })
    }

    catch(error){
        return NextResponse.json({
            message : "Error fetching user role"
        })
    }
}