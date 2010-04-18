package com.lvh.strobedraw;

import java.util.Map;
import java.util.HashMap;
import java.net.*;
import java.io.*;

import org.cometd.Bayeux;
import org.cometd.Client;
import org.cometd.Message;
import org.cometd.server.BayeuxService;

public class StrobeDraw extends BayeuxService
{
	String savedStrokes = "{ \"oldStrokes\" : [";
	int strokeNum = 0;
	float[][][] SUBQUAD = new float[15][20][20];
	float[] QUAD = new float[15];
	long grandTotal = 0;
	long pausePeriod = 10000;
	String[] masterColor = {"black","white"};
	int colorChoice = 0;
	
	
    public StrobeDraw(Bayeux bayeux)
    {
        super(bayeux, "drawing");
        subscribe("/drawing", "processAll");
    }

    public void processAll(Client remote, Message message)
    {
        Map<String, Object> input = (Map<String, Object>)message.getData();
        String position = (String)input.get("position");
        
        if(input.get("addData") != null) {
        	// get quad/subquad/color data
        	Map<String, Object> output = new HashMap<String, Object>();
			String addData = (String)input.get("addData");
	        updateGrid(addData);        	
        } else if(input.get("joinUp") != null) {
        	// something to happen when a user joins?
        } else {
	        Map<String, Object> output = new HashMap<String, Object>();
	        // position should also include the color to draw with
    	    output.put("position", position);
    	    output.put("masterColor", masterColor[colorChoice]);
        	remote.deliver(getClient(), "/drawing", output, null);
	        System.out.print(position);
    	    saveStroke(position);
        	if(strokeNum >= 10) {
        		clearStrokes();
	        	strokeNum = 0;
    	    }
    	}
        grandTotal = analyzeGrid();    	
    }
    
    public void saveStroke(String d) {
    	strokeNum ++;
    	savedStrokes += d;
    	savedStrokes += ",";
    	System.out.println(" STROKE NUM " + strokeNum);
    }
    
	 public long analyzeGrid() {
		for(int h = 0; h < 15; h++) {
	    	int quadTotal = 0;
    		for(int i = 0; i < 20; i++) {
	    		int subQuadTotal = 0;    	
    			for(int j = 0; j < 20; j++) {
	   				subQuadTotal += SUBQUAD[h][i][j];
				}
				quadTotal += subQuadTotal;
    		}
    		grandTotal += quadTotal;
	   	}
    	System.out.println(grandTotal);
    	if(grandTotal > 300000) {
    		// switch colors and reset counter;
    		switch(colorChoice) {
    			case 0:
    				colorChoice = 1;
    				break;
    			case 1:
    				colorChoice = 0;
    				break;
    		}

    		grandTotal = 0;
    	}
    	return grandTotal;
	}
    
    public void updateGrid(String d) {
    	String[] rawData = d.split(",");
    	int sQuad = Integer.parseInt(rawData[1]);
    	int subQuadX = Integer.parseInt(rawData[2]);
    	int subQuadY = Integer.parseInt(rawData[3]);
    	int colorBlock = Integer.parseInt(rawData[0]);
    	
    	SUBQUAD[sQuad][subQuadX][subQuadY] = colorBlock;
    }
    
    public void clearStrokes() {
    	// this function pushes the current status of the drawing to a remote file
    	// so new visitors can start with a canvas "already in progress"
    	String dLog = "http://hotsocieties.com/proj/drawserver-v1/drawlogs/takenotes.php";
    	DataOutputStream dos;
    	DataInputStream dis;
    	
    	// take off final comma?  you don't really have to...  perhaps that's what throws the chrome error?
    	
    	savedStrokes += " ] }";
    	
    	try {
    		URL url = new URL(dLog);
    		URLConnection theCon = url.openConnection();
    		theCon.setDoOutput(true);
    		theCon.setDoInput(true);
    		theCon.setUseCaches(false);
    		theCon.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
    		
    		dos = new DataOutputStream(theCon.getOutputStream());
    		String content = "savedStrokes=";
    		content += savedStrokes; 
    		dos.writeBytes(content);
    		dos.flush();
    		dos.close();
    		
    		dis = new DataInputStream(theCon.getInputStream());
    		String reCall;
    		while(null !=((reCall = dis.readLine()))) {
    			System.out.println(reCall);
    		}
    		dis.close();
    		
    	} catch (MalformedURLException e) {
    		System.out.println(e);
    	} catch (IOException e) {
    		System.out.println(e);
    	}
    	savedStrokes = "{ \"oldStrokes\" : [";
    }
}